class Post < ApplicationRecord
    belongs_to :user
    has_one_attached :image
    has_many :comments, dependent: :destroy
    has_many :likes, dependent: :destroy
    validates :title, presence: true
    validates :image, presence: true

    private

    def image_presence
      errors.add(:image, "must be attached") unless image.attached?
    end
    
end
