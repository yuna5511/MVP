class PlansController < ApplicationController
  def create
    Rails.logger.info "Received request with params: #{params.inspect}"
    plan = PlanService.create_plan(
      user_ids: plan_params[:user_ids],
      start_date: plan_params[:start_date],
      end_date: plan_params[:end_date],
      places: plan_params[:places]
    )

    if plan.persisted?
      render json: { message: "プランの作成に成功", plan: serialize_plan(plan) }, status: :created
    else
      render json: { errors: plan.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    plan = Plan.find_by(id: params[:id])

    if plan
      render json: { plan: serialize_plan(plan) }, status: :ok
    else
      render json: { error: "プランが見つかりませんでした" }, status: :not_found
    end
  end

  def update
    plan = Plan.find_by(id: params[:id])

    if plan.nil?
      return render json: { error: 'Plan not found' }, status: :not_found
    end

    if update_plan(plan, plan_update_params)
      render json: { message: 'プランの更新に成功', plan: serialize_plan(plan) }, status: :ok
    else
      render json: { errors: plan.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def plan_params
    params.require(:plan).permit(:start_date, :end_date, places: [], user_ids: [])
  end

  def serialize_plan(plan)
    {
      id: plan.id,
      userIds: plan.users.map(&:id),
      title: plan.title,
      isPublic: plan.is_public,
      notes: plan.notes || '',
      places: plan.places.as_json(only: [:id, :name, :google_place_id, :notes]),
      itinerary: {
        startDate: plan.itinerary&.start_date,
        endDate: plan.itinerary&.end_date,
        days: plan.itinerary&.days&.map do |day|
          {
            id: day.id,
            date: day.date
          }
        end || []
      },
      hotels: plan.hotels&.map do |hotel|
        {
          id: hotel.id,
          google_place_id: hotel.google_place_id,
          check_in: hotel.check_in,
          check_out: hotel.check_out,
          confirmation_id: hotel.confirmation_id,
          note: hotel.note
        }
      end || [],
      flights: plan.flights&.map do |flight|
        {
          id: flight.id,
          flight_number: flight.flight_number,
          airline: flight.airline,
          depart_date: flight.depart_date,
          has_depart_time: flight.has_depart_time,
          depart_airport: flight.depart_airport,
          arrive_date: flight.arrive_date,
          has_arrive_time: flight.has_arrive_time,
          arrive_airport: flight.arrive_airport,
          confirmation_id: flight.confirmation_id,
          note: flight.note
        }
      end || []
    }
  end

  def plan_update_params
    params.require(:plan).permit(
      :title,
      :is_public,
      :notes,
      :start_date,
      :end_date,
      places: [],
      user_ids: [],
      hotels_attributes: [:id, :google_place_id, :check_in, :check_out, :confirmation_id, :note, :_destroy],
      flights_attributes: [
        :id,
        :flight_number,
        :airline,
        :depart_date,
        :has_depart_time,
        :depart_airport,
        :arrive_date,
        :has_arrive_time,
        :arrive_airport,
        :confirmation_id,
        :note,
        :_destroy
      ]
    )
  end

  def update_plan(plan, params)
    plan.assign_attributes(
      title: params[:title] || plan.title,
      is_public: params.key?(:is_public) ? params[:is_public] : plan.is_public,
      notes: params[:notes] || plan.notes
    )

    if params[:places]
      plan.places = params[:places].map do |place_name|
        Place.find_or_initialize_by(plan_id: plan.id, name: place_name)
      end
    end

    if params[:user_ids]
      user_ids = Array(params[:user_ids]).select { |id| id.to_s.match?(/^\d+$/) }
      plan.users = User.where(id: user_ids)
    end

    if params[:hotels_attributes]
      plan.hotels_attributes = params[:hotels_attributes]
    end

    if params[:flights_attributes]
      plan.flights_attributes = params[:flights_attributes]
    end

    plan.save
  end
end
