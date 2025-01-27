Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Specify your frontend origins explicitly
    # origins 'http://localhost:3001', 'http://192.168.1.5:3001'
    origins 'https://www.e-nutritionist.coom', 'https://www.otimasvrei.g'

    # Allow all resource types with specific methods
    resource '*',
             headers: :any,
             methods: [:get, :post, :put, :patch, :delete, :options, :head],
             credentials: true # Allow credentials if needed
  end
end
