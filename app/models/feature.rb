class Feature < ApplicationRecord
  belongs_to :service_plan

  validates :name, presence: true
end
