class DrawingsController < ApplicationController
  before_action :authenticate_user!
     require 'httparty'
     def index
    end

    def search_pexels
      query = params[:query] || 'art'
      
      response = HTTParty.get(
        'https://api.pexels.com/v1/search',
        query: { query: query, per_page: 10 },
        headers: { 'Authorization' => ENV['PEXELS_API_KEY'] }
      )
    
      if response.success?
        # Remove the JSON.parse here - Pexels API already returns JSON
        render json: response.parsed_response
      else
        render json: { error: response.parsed_response['error'] || 'API request failed' }, 
               status: :unprocessable_entity
      end
    rescue => e
      render json: { error: e.message }, status: :internal_server_error
    end
  end


