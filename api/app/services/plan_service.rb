require 'ostruct'
require 'net/http'
require 'json'

class PlanService
  def self.create_plan(user_ids:, start_date:, end_date:, places:)
    valid_user_ids = Array(user_ids).select { |id| id.to_s.match?(/^\d+$/) }
    users = User.where(id: valid_user_ids) if valid_user_ids.present?

    if places.nil? || places.empty?
      Rails.logger.error "プランのための場所は用意されていない"
      raise ArgumentError, "場所を空にすることはできない"
    end

    # プランを作成する（ユーザーなしで許可する）
    plan = Plan.new(is_public: false, title: "#{places.join('、')}へ！")
    plan.users = users if users.present? # ユーザーなしでプランが存在できるようにする

    if plan.save(validate: false) # 保存時に検証をスキップし、ユーザー検証の衝突を避ける
      itinerary = Itinerary.create!(
        plan: plan,
        start_date: start_date,
        end_date: end_date
      )

      create_days(itinerary, start_date, end_date) # Create days for the itinerary

      places.each do |place_name|
        Rails.logger.info "place: #{place_name}"
        google_result = fetch_google_result(place_name)
        if google_result
          Place.create!(
            plan: plan,
            name: google_result.description, # Use description
            google_place_id: google_result.place_id, # Use place_id
            link: "https://www.google.com/maps/place/?q=place_id:#{google_result.place_id}" # Construct the link
          )
        else
          Rails.logger.warn "No Google result found for place: #{place_name}"
        end
      end      

      plan
    else
      Rails.logger.error "Failed to save plan: #{plan.errors.full_messages}"
      plan
    end
  end

  private

  def self.create_days(itinerary, start_date, end_date)
    parsed_start_date = parse_date(start_date)
    parsed_end_date = parse_date(end_date)
  
    raise ArgumentError, "Invalid date range" if parsed_start_date > parsed_end_date
  
    current_date = parsed_start_date
    while current_date <= parsed_end_date
      Rails.logger.info "Creating day: #{current_date}"
      Day.create!(itinerary: itinerary, date: current_date)
      current_date += 1.day
    end
  end
  
  def self.parse_date(date)
    return date if date.is_a?(Date)
    Date.parse(date.to_s)
  rescue ArgumentError
    raise ArgumentError, "Invalid date format: #{date}"
  end
  

  def self.fetch_google_result(location)
    return nil if location.nil? || location.strip.empty?
  
    google_api_key = ENV['GOOGLE_API_KEY'] || Rails.application.credentials.dig(:google_places, :api_key)
    uri = URI("https://places.googleapis.com/v1/places:autocomplete")
  
    # Create a POST request
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    request = Net::HTTP::Post.new(uri.path, { 
      'Content-Type' => 'application/json',
      'X-Goog-Api-Key' => google_api_key # Pass API key in the header
    })
  
    # Construct the JSON body for the request
    request.body = {
      input: location,
    }.to_json
  
    begin
      response = http.request(request)
      response_body = JSON.parse(response.body)
  
      if response.is_a?(Net::HTTPSuccess)
        Rails.logger.info "Google API response: #{response_body.inspect}"
        result = response_body['suggestions']&.first&.dig('placePrediction')
        if result
          # Extract relevant fields and return as OpenStruct
          OpenStruct.new(
            description: result['structuredFormat']['mainText']['text'],
            place_id: result['placeId']
          )
        else
          Rails.logger.warn "No predictions found for #{location}"
          nil
        end
      else
        Rails.logger.error "Google Places API call failed: #{response_body.inspect}"
        nil
      end
    rescue StandardError => e
      Rails.logger.error "Error fetching Google Place ID: #{e.message}"
      nil
    end
  end  
end
