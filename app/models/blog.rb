class Blog < ApplicationRecord
  # Validations
  validates :title, :description, :category, :published_at, :content, presence: true
  validates :content, format: { with: /<\/?[a-z][\s\S]*>/i, message: "must contain valid HTML" }
  validates :slug, uniqueness: true
  validates :meta_title, length: { maximum: 60, message: "must be at most 60 characters" }, allow_blank: true
  validates :meta_description, length: { maximum: 160, message: "must be at most 160 characters" }, allow_blank: true
  validates :meta_keywords, length: { maximum: 255, message: "must be at most 255 characters" }, allow_blank: true

  # Callbacks
  before_save :generate_slug

  private

  def generate_slug
    # Only generate the slug if it is not already set
    self.slug ||= title.parameterize if title.present?
  end
end
