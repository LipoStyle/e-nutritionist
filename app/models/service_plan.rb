class ServicePlan < ApplicationRecord
  has_many :features, dependent: :destroy

  accepts_nested_attributes_for :features, allow_destroy: true

  validates :title, presence: true
  validates :price, presence: true, numericality: { only_integer: true }
  validates :description, presence: true
end
