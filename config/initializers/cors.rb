Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'https://www.e-nutritionist.com', 'https://www.otimasvrei.gr', 'http://192.168.1.5:3001', 'http://localhost:3001'

    resource '*',
             headers: :any,
             methods: [:get, :post, :put, :patch, :delete, :options, :head],
             credentials: true
  end
end
