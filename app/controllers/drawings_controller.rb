class DrawingsController < ApplicationController
  # Only allow logged-in users to use this controller
  before_action :authenticate_user!

  # Include the HTTParty gem so we can make external API requests
  require 'httparty'

  # GET /drawings
  def index
    # Currently empty — you could use this to show featured images later
  end

  # POST /drawings/search_pexels
  def search_pexels
    # Get the search term from the user input, or use "art" by default
    query = params[:query] || 'art'

    # Send a GET request to the Pexels API using the HTTParty gem
    response = HTTParty.get(
      'https://api.pexels.com/v1/search',     # API endpoint for image search
      query: { query: query, per_page: 10 },  # Search term and limit to 10 images
      headers: {
        # Your personal API key for authenticating with Pexels
        'Authorization' => 'LV0g5iRmKbPVvsd3ZJTnYXb0zEou6MCOF2yfsndxWIqadPuh5eOeh7Iu'
      }
    )

    # If the request was successful (HTTP 200)
    if response.success?
      # Return the data as JSON to the frontend (JS will use this)
      render json: response.parsed_response
    else
      # If the API responded with an error, return the message and status code 422
      render json: {
        error: response.parsed_response['error'] || 'API request failed'
      }, status: :unprocessable_entity
    end

  # Catch any unexpected errors (like timeouts, broken connection, etc.)
  rescue => e
    render json: { error: e.message }, status: :internal_server_error
  end
end

