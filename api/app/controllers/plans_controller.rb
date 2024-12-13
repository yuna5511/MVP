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
    
    user_id = params[:user_ids].first  # Assuming you're passing an array of userIds, you can handle logic accordingly
    
    if plan.user_ids.include?(user_id)
      return render json: { plan: plan }, status: :ok
    else
      plan.user_ids << user_id  # Add the user as part of the plan
      if plan.save
        render json: { plan: plan }, status: :ok
      else
        render json: { errors: plan.errors.full_messages }, status: :unprocessable_entity
      end
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
      places: plan.places.as_json(only: [:id, :name, :google_place_id]),
      itinerary: {
        startDate: plan.itinerary.start_date,
        endDate: plan.itinerary.end_date
      }
    }
  end
end
