require 'google_places'

class PlanService
  def self.create_plan(user_ids:, start_date:, end_date:, places:)
    valid_user_ids = Array(user_ids).select { |id| id.to_s.match?(/^\d+$/) }
    users = User.where(id: valid_user_ids) if valid_user_ids.present?

    if places.nil? || places.empty?
      Rails.logger.error "No places provided for the plan."
      raise ArgumentError, "Places cannot be empty"
    end

    # プランを作成する（ユーザーなしで許可する）
    plan = Plan.new(is_public: false, title: "#{places.join('、')}へ！")
    plan.users = users if users.present? # ユーザーなしでプランが存在できるようにする

    if plan.save(validate: false) # 保存時に検証をスキップし、ユーザー検証の衝突を避ける
      Itinerary.create!(
        plan: plan,
        start_date: start_date,
        end_date: end_date
      )

      places.each do |place_name|
        Rails.logger.info "place: #{place_name}"
        google_place_id = fetch_google_id(place_name)
        Place.create!(
          plan: plan,
          name: place_name,
          google_place_id: google_place_id
        )
      end

      plan
    else
      Rails.logger.error "Failed to save plan: #{plan.errors.full_messages}"
      plan
    end
  end

  private

  def self.fetch_google_id(location)
    return nil if location.nil? || location.strip.empty?
  
    client = GooglePlaces::Client.new(ENV['GOOGLE_API_KEY'] || Rails.application.credentials.dig(:google_places, :api_key))
    begin
      results = client.predictions_by_input(location, types: "geocode")
      Rails.logger.info "Google API response for #{location}: #{results.first.inspect}"
  
      if results.empty?
        Rails.logger.warn "No results found for #{location}"
        nil
      else
        results.first.place_id
      end
    rescue StandardError => e
      Rails.logger.error "Google Place ID fetch failed for #{location}: #{e.message}"
      nil
    end
  end
end
