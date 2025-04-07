class LikesController < ApplicationController
    before_action :authenticate_user!
  
    def create
        @post = Post.find(params[:post_id])
        @like = current_user.likes.build(post: @post)
    
        respond_to do |format|
          if @like.save
            format.html { redirect_back(fallback_location: root_path, notice: 'Post liked!') }
            format.js   # This will look for create.js.erb
          else
            format.html { redirect_back(fallback_location: root_path, alert: 'Failed to like post') }
          end
        end
      end
    
      def destroy
        @like = current_user.likes.find(params[:id])
        @post = @like.post
        @like.destroy
    
        respond_to do |format|
          format.html { redirect_back(fallback_location: root_path, notice: 'Post unliked!') }
          format.js   # This will look for destroy.js.erb
        end
      end
    end
  
    private 
    
    def like_params
      params.require(:like).permit(:post_id)
    end
