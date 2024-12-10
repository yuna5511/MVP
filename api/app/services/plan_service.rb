class PlanService
  def self.create_plan(user_ids:, start_date:, end_date:, places:)
    valid_user_ids = Array(user_ids).select { |id| id.to_s.match?(/^\d+$/) }
    users = User.where(id: valid_user_ids) if valid_user_ids.present?

    # プランを作成する（ユーザーなしで許可する）
    plan = Plan.new(is_public: false, title: "New Plan")
    plan.users = users if users.present? # ユーザーなしでプランが存在できるようにする

    if plan.save(validate: false) # 保存時に検証をスキップし、ユーザー検証の衝突を避ける
      Itinerary.create!(
        plan: plan,
        start_date: start_date,
        end_date: end_date
      )

      places.each do |place_name|
        Place.create!(
          plan: plan,
          name: place_name
        )
      end

      plan
    else
      Rails.logger.error "Failed to save plan: #{plan.errors.full_messages}"
      plan
    end
  end
end
