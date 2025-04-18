Rails.application.routes.draw do
  # Static pages
  get "static_pages/home"

  # Devise routes with custom controllers
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }

  # Posts with comments and likes
  resources :posts do
    resources :comments, only: [:create, :edit, :update, :destroy]
    resources :likes, only: [:create, :destroy]
  end

  # Drawings routes
  resources :drawings do
    collection do
      post 'search_pexels'  # Creates POST /drawings/search_pexels
    end
  end

  # Additional drawing routes
  get "draw", to: "drawings#index"
  post 'drawings/index', to: 'drawings#index'

  # Users resources
  resources :users

  # Root route
  root "posts#index"
end