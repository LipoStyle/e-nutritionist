class CreateRecipes < ActiveRecord::Migration[8.0]
  def change
    create_table :recipes do |t|
      t.string :title
      t.text :ingredients
      t.text :instructions
      t.integer :prep_time
      t.integer :cook_time
      t.integer :servings
      t.string :image
      t.string :category

      t.timestamps
    end
  end
end
