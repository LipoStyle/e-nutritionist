class Api::V1::ServicePlansController < ApplicationController
  before_action :set_service_plan, only: [:show, :update, :destroy]

  # GET /service_plans
  def index
    service_plans = ServicePlan.includes(:features).all
    render json: service_plans, include: :features
  end

  # POST /service_plans
  def create
    service_plan = ServicePlan.new(service_plan_params)

    if service_plan.save
      render json: service_plan, include: :features, status: :created
    else
      render json: service_plan.errors, status: :unprocessable_entity
    end
  end

  # GET /service_plans/:id
  def show
    render json: @service_plan, include: :features
  end

  # PUT /service_plans/:id
  def update
    if @service_plan.update(service_plan_params)
      render json: @service_plan, include: :features
    else
      render json: @service_plan.errors, status: :unprocessable_entity
    end
  end

  # DELETE /service_plans/:id
  def destroy
    @service_plan.destroy
    head :no_content
  end

  private

  def set_service_plan
    @service_plan = ServicePlan.find(params[:id])
  end

  def service_plan_params
    params.require(:service_plan).permit(:title, :price, :description, features_attributes: [:id, :name, :_destroy])
  end
end
