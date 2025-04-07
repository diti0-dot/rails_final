class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

         has_one_attached :image
         has_many :posts, dependent: :destroy
         has_many :comments, dependent: :destroy
         has_many :likes, dependent: :destroy
         attr_accessor :login 
         
         def self.find_for_database_authentication warden_condition
          conditions = warden_condition.dup
          login = conditions.delete(:login)
          where(conditions).where(
            ["lower(username) = :value OR lower(email) = :value",
            { value: login.strip.downcase}]).first
        end
end
