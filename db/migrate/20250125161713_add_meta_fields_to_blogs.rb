class AddMetaFieldsToBlogs < ActiveRecord::Migration[8.0]
  def change
    add_column :blogs, :meta_title, :string
    add_column :blogs, :meta_description, :text
    add_column :blogs, :meta_keywords, :string
  end
end
