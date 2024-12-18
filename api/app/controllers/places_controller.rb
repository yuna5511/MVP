require 'net/http'
require 'uri'
require 'json'

class PlacesController < ApplicationController
  def autocomplete
    input = params[:input]
    Rails.logger.info "input: #{input}"
    if input.blank?
      render json: { predictions: [] }
      return
    end

    google_api_key = ENV['GOOGLE_API_KEY'] || Rails.application.credentials.dig(:google_places, :api_key)
    uri = URI("https://places.googleapis.com/v1/places:autocomplete")

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    request = Net::HTTP::Post.new(uri.path, {
      'Content-Type' => 'application/json',
      'X-Goog-Api-Key' => google_api_key
    })

    request.body = {
      input: input,
    }.to_json

    begin
      response = http.request(request)
      response_body = JSON.parse(response.body)

      if response.is_a?(Net::HTTPSuccess)
        Rails.logger.info "Google API response: #{response_body.inspect}"
        predictions = response_body['suggestions'].map do |prediction|
          place_prediction = prediction.dig('placePrediction')
          {
            description: place_prediction['structuredFormat']['mainText']['text'],
            place_id: place_prediction['placeId'],
            types: place_prediction['types']
          }
        end
        render json: { predictions: predictions }
      else
        Rails.logger.error "Google Places API call failed: #{response_body.inspect}"
        render json: { error: "Google Placesの検索に失敗しました" }, status: :bad_request
      end
    rescue StandardError => e
      Rails.logger.error "Error fetching Google Place ID: #{e.message}"
      nil
    end
  end

  def create
    place_params = params.require(:place).permit(:name, :google_place_id, :link, :start_time, :end_time, :day_id, :plan_id, :notes)
    @place = Place.new(place_params)

    if @place.save
      render json: { success: true, place: @place }, status: :created
    else
      render json: { success: false, errors: @place.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    place_params = params.require(:place).permit(:name, :google_place_id, :link, :start_time, :end_time, :day_id, :plan_id, :notes)
    @place = Place.find_by(id: params[:id])
  
    if @place.nil?
      render json: { success: false, error: "場所が見つかりません" }, status: :not_found
      return
    end
  
    if @place.update(place_params)
      render json: { success: true, place: @place }, status: :ok
    else
      render json: { success: false, errors: @place.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @place = Place.find(params[:id])

    if @place.destroy
      render json: { success: true, message: '削除に成功した場所' }, status: :ok
    else
      render json: { success: false, errors: @place.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
