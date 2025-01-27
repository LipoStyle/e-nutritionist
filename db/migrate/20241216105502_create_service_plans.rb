class CreateServicePlans < ActiveRecord::Migration[8.0]
  def change
    create_table :service_plans do |t|
      t.string :title
      t.integer :price
      t.text :description

      t.timestamps
    end
  end
end
