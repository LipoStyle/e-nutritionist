Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  get '/blogs/:slug', to: 'blogs#show', as: 'blog'

  namespace :api do
    namespace :v1 do
      # admin session manage
      post "admin/login", to: "admin_sessions#create"
      delete "admin/logout", to: "admin_sessions#destroy"

      # services plan resources
      resources :service_plans do
        resources :features, only: [:create, :destroy]
      end

      # resources for recipes 
      resources :recipes

      # resourses for blogs
      resources :blogs, param: :slug, only: [:index, :show, :create, :destroy]

    end
  end

end
