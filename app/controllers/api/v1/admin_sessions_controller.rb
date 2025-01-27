class Api::V1::AdminSessionsController < ApplicationController
  def create
    admin = Admin.find_by(username: params[:username])

    if admin&.authenticate(params[:password])
      session[:admin_id] = admin.id
      render json: { message: "Login successful", admin: admin.username }, status: :ok
    else
      render json: { error: "Invalid username or password" }, status: :unauthorized
    end
  end

  def destroy
    session[:admin_id] = nil
    render json: { message: "Logged out successfully" }, status: :ok
  end
end
