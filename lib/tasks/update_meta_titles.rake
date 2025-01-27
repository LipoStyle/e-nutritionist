namespace :blogs do
  desc "Update meta_title with the value of title"
  task update_meta_titles: :environment do
    Blog.find_each do |blog|
      blog.update(meta_title: blog.title)
    end
    puts "Meta titles updated successfully!"
  end
end
