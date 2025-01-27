class CreateBlogs < ActiveRecord::Migration[8.0]
  def change
    create_table :blogs do |t|
      t.string :title
      t.string :image
      t.text :description
      t.string :category
      t.date :published_at
      t.text :content

      t.timestamps
    end
  end
end
