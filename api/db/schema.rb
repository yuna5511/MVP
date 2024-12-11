# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2024_12_11_154859) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "days", force: :cascade do |t|
    t.date "date"
    t.bigint "itinerary_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["itinerary_id"], name: "index_days_on_itinerary_id"
  end

  create_table "itineraries", force: :cascade do |t|
    t.date "start_date"
    t.date "end_date"
    t.bigint "plan_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["plan_id"], name: "index_itineraries_on_plan_id"
  end

  create_table "places", force: :cascade do |t|
    t.string "name"
    t.string "google_place_id"
    t.string "link"
    t.datetime "start_time"
    t.datetime "end_time"
    t.bigint "day_id"
    t.bigint "plan_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["day_id"], name: "index_places_on_day_id"
    t.index ["plan_id"], name: "index_places_on_plan_id"
  end

  create_table "plans", force: :cascade do |t|
    t.string "title"
    t.boolean "is_public"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "owner_id"
    t.index ["owner_id"], name: "index_plans_on_owner_id"
  end

  create_table "plans_users", id: false, force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "plan_id", null: false
    t.index ["plan_id"], name: "index_plans_users_on_plan_id"
    t.index ["user_id", "plan_id"], name: "index_plans_users_on_user_id_and_plan_id", unique: true
    t.index ["user_id"], name: "index_plans_users_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "days", "itineraries"
  add_foreign_key "itineraries", "plans"
  add_foreign_key "places", "days"
  add_foreign_key "places", "plans"
  add_foreign_key "plans", "users", column: "owner_id"
end
