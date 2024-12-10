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
      render json: { message: "プランの作成に成功", plan: plan }, status: :created
    else
      render json: { errors: plan.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def plan_params
    params.require(:plan).permit(:start_date, :end_date, places: [], user_ids: [])
  end
end
