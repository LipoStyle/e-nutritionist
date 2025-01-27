class Api::V1::BlogsController < ApplicationController
  before_action :set_blog, only: [:destroy]

  # GET /blogs
  def index
    blogs = Blog.all.order(created_at: :desc)
    render json: blogs
  end

  # GET /blogs/:slug
  def show
    blog = Blog.find_by(slug: params[:slug])
    if blog
      render json: blog
    else
      render json: { error: 'Blog not found' }, status: :not_found
    end
  end

  # POST /blogs
  def create
    blog = Blog.new(blog_params)
    if blog.save
      render json: blog, status: :created
    else
      render json: { errors: blog.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /blogs/:slug
  def destroy
    if @blog.destroy
      render json: { message: "Blog deleted successfully" }, status: :ok
    else
      render json: { errors: @blog.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_blog
    @blog = Blog.find_by(slug: params[:slug])
    render json: { error: 'Blog not found' }, status: :not_found unless @blog
  end

  def blog_params
    params.permit(:title, :image, :category, :description, :content, :published_at, :slug)
  end
end
