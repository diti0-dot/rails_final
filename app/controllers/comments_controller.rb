class CommentsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_post
  
    def index
      @comments = @post.comments
    end
  
    def new
      @comment = @post.comments.build
    end
  
    def create
      @comment = @post.comments.build(comment_params)
      @comment.user = current_user
  
      if @comment.save
        redirect_to @post, notice: "Comment added!"
      else
        redirect_to @post, notice: "Couldn't save comment"
      end
    end
  
    def edit
      @comment = @post.comments.find(params[:id])
    end
  
    def update
      @comment = @post.comments.find(params[:id])
  
      if @comment.update(comment_params)
        redirect_to @post, status: :see_other, notice: 'Comment was successfully updated.'
      else
        render :edit, alert: "Error updating comment"
      end
    end
  
    def destroy
      @comment = current_user.comments.find(params[:id])
      @comment.destroy
  
      redirect_to @comment.post, notice: "Comment deleted :("
    end
  
    private
  
    def set_post
      @post = Post.find(params[:post_id])
    end
  
    def comment_params
      params.require(:comment).permit(:body)
    end
  end
  