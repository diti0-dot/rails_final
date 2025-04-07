Rails.application.routes.draw do
  get "drawings/index"
  get "users/show"
  # Devise routes with custom controllers
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }

  resources :posts do
    resources :comments, only: [:create, :edit, :update, :destroy]
    resources :likes, only: [:create, :destroy]
  end

  get "draw", to: "drawings#index"
  post 'drawings/index', to: 'drawings#index'

  resources :users
  root "posts#index"
  
end


