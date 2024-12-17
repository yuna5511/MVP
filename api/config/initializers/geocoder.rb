Geocoder.configure(
  lookup: :google,
  api_key: ENV['GOOGLE_API_KEY'],
  timeout: 10,
  use_https: true
)
