class User < ApplicationRecord
  # Include default devise modules
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: %i[google_oauth2]

  has_one_attached :image
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  attr_accessor :login

  def self.from_omniauth(auth)
    Rails.logger.debug "Auth data: #{auth.inspect}"

    # First try to find by provider and uid
    user = where(provider: auth.provider, uid: auth.uid).first_or_initialize

    # If user is new, check if email already exists in database
    if user.new_record?
      existing_user = find_by(email: auth.info.email)
      return existing_user if existing_user

      # Set attributes for new user
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      user.username = auth.info.name || auth.info.email.split('@').first
    end

    # Save with validation disabled temporarily
    user.save!(validate: false)
    user
  rescue => e
    Rails.logger.error "Omniauth error: #{e.message}"
    nil
  end

  def self.find_for_database_authentication(warden_condition)
    conditions = warden_condition.dup
    login = conditions.delete(:login)
    where(conditions).where(
      ["lower(username) = :value OR lower(email) = :value",
      { value: login.strip.downcase}]).first
  end

  
  def admin?
    admin || false  # Returns false if admin is nil
  end
  

end