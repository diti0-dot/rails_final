require "test_helper"

class DrawingsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get drawings_index_url
    assert_response :success
  end
end
