class PostsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :set_post, only: [:show, :edit, :update, :destroy]

  def index
    @posts = Post.includes(:user, :likes).order(created_at: :desc)
  end

  def show
    @comment = Comment.new(post: @post)
    @like = @post.likes.find_by(user: current_user) if user_signed_in?
  end

  def new
    @post = current_user.posts.new
    @drawing_data = session.delete(:pending_drawing_data) if session[:pending_drawing_data]
  end

  def edit
  end

  def create
    @post = current_user.posts.build(post_params)
    
    if params[:post][:drawing_data].present?
      attach_image_from_data(@post, params[:post][:drawing_data])
    end
  
    if @post.save
      Rails.logger.info "Post saved successfully: #{@post.inspect}"
      redirect_to posts_path, notice: "Post was successfully created!"
    else
      Rails.logger.error "Post failed to save: #{@post.errors.full_messages}"
      render :new
    end
  end
  

  def update
    if @post.update(post_params)
      redirect_to @post, notice: 'Post was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @post.destroy
    redirect_to posts_url, notice: 'Post was successfully deleted.'
  end

  # Separate endpoint for handling drawing uploads
  def handle_upload
    if params[:drawing_data].present?
      session[:pending_drawing_data] = params[:drawing_data]
      render json: { redirect_url: new_post_path }
    else
      render json: { error: 'No drawing data received' }, status: :bad_request
    end
  end

  private

  def attach_image_from_data(post, image_data)
    begin
      # Remove data URL prefix if present
      image_data = image_data.split(',')[1] if image_data.start_with?('data:')
      decoded_image = Base64.decode64(image_data)
      
      post.image.attach(
        io: StringIO.new(decoded_image),
        filename: "pixel-art-#{Time.now.to_i}.png",
        content_type: 'image/png'
      )
    rescue => e
      Rails.logger.error "Image processing failed: #{e.message}"
      post.errors.add(:image, 'could not be processed')
    end
  end


  def set_post
    @post = Post.find(params[:id])
  end

  def post_params
    params.require(:post).permit(:title, :body, :image)
  end


end