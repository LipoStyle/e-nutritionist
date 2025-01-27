source "https://rubygems.org"

gem "rails", "~> 8.0.0"
gem "pg", "~> 1.2"
gem "puma", ">= 5.0"
gem "tzinfo-data", platforms: %i[ windows jruby ]
gem "solid_cache"
gem "solid_queue"
gem "solid_cable"
gem "bootsnap", require: false
gem "kamal", require: false
gem 'rack-cors'
gem 'bcrypt', '~> 3.1.7'

gem "thruster", require: false


group :development, :test do
  gem "debug", platforms: %i[ mri windows ], require: "debug/prelude"
  gem "brakeman", require: false
  gem "rubocop-rails-omakase", require: false
  gem 'dotenv-rails', groups: [:development, :test]
end


