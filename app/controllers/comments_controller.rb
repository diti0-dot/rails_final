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

    respond_to do |format|
      if @comment.save
        format.turbo_stream do
          render turbo_stream: turbo_stream.append(
            "post-#{@post.id}-comments",
            partial: 'comments/comment',
            locals: { comment: @comment }
          )
        end
        format.html { redirect_to @post, notice: "Comment added!" }
      else
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            "new-comment-form",
            partial: 'comments/form',
            locals: { comment: @comment, post: @post }
          )
        end
        format.html { redirect_to @post, alert: "Couldn't save comment" }
      end
    end
  end

  def edit
    @comment = @post.comments.find(params[:id])
  end

  def update
     @comment = @post.comments.find(params[:id])
  
  respond_to do |format|
    if @comment.update(comment_params)
      format.turbo_stream
      format.html { redirect_to @post, notice: 'Comment updated' }
    else
      format.turbo_stream { render :edit }
      format.html { render :edit }
    end
  end
  end

  def destroy
    @comment = current_user.comments.find(params[:id])

    respond_to do |format|
      @comment.destroy
      format.turbo_stream do
        render turbo_stream: turbo_stream.remove("comment-#{@comment.id}")
      end
      format.html { redirect_to @comment.post, notice: "Comment deleted :(" }
    end
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  end

  def comment_params
    params.require(:comment).permit(:body)
  end
end