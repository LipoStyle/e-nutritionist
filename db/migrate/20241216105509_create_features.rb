class CreateFeatures < ActiveRecord::Migration[8.0]
  def change
    create_table :features do |t|
      t.string :name
      t.references :service_plan, null: false, foreign_key: true

      t.timestamps
    end
  end
end
