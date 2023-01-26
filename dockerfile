# Alpine 3.x
# Ruby 2.x
# FROM ruby:2.7-slim-bullseye
FROM ruby:2.7-alpine3.15

WORKDIR /jekyll-website
COPY Gemfile ./

RUN apk update && apk add --no-cache build-base gcc cmake git
RUN gem update --system && \
    gem update bundler
    # && \
    # bundle install
    # gem install jekyll-sass-converter -v ~>2.0 && \
    # gem install sass-embedded -v 1.53.0 && \
    # gem install jekyll -v 3.9.2



# Run these in a connected shell if you're mounting a dev environment bind
# RUN bundle init && \
#     bundle add jekyll --version "~>3.9.0" && \
#     bundle exec jekyll new --force --skip-bundle .

# ENTRYPOINT ["bundle", "exec", "jekyll serve --livereload"]