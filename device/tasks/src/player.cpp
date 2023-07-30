#include <iostream>
#include <SDL2/SDL.h>
#include <SDL2/SDL_image.h>

int main() {
  // Initialize SDL.
  if (SDL_Init(SDL_INIT_VIDEO) < 0) {
    std::cout << "Error initializing SDL: " << SDL_GetError() << std::endl;
    return 1;
  }

  // Create a window.
  SDL_Window *window = SDL_CreateWindow("Video Player", SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, 640, 480, SDL_WINDOW_SHOWN);
  if (window == nullptr) {
    std::cout << "Error creating window: " << SDL_GetError() << std::endl;
    return 1;
  }

  // Create a renderer.
  SDL_Renderer *renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);
  if (renderer == nullptr) {
    std::cout << "Error creating renderer: " << SDL_GetError() << std::endl;
    return 1;
  }

  // Load the video file.
  SDL_Surface *surface = IMG_Load("v.mp4");
  if (surface == nullptr) {
    std::cout << "Error loading video file: " << IMG_GetError() << std::endl;
    return 1;
  }

  // Create a texture from the surface.
  SDL_Texture *texture = SDL_CreateTextureFromSurface(renderer, surface);
  SDL_FreeSurface(surface);

  // Set the video to play in full screen.
  SDL_SetWindowFullscreen(window, SDL_WINDOW_FULLSCREEN);

  // Play the video.
  while (true) {
    // Clear the screen.
    SDL_RenderClear(renderer);

    // Render the texture.
    SDL_RenderCopy(renderer, texture, nullptr, nullptr);

    // Update the screen.
    SDL_RenderPresent(renderer);

    // Check for user input.
    SDL_Event event;
    while (SDL_PollEvent(&event)) {
      if (event.type == SDL_QUIT) {
        break;
      }
    }
  }

  // Cleanup.
  SDL_DestroyTexture(texture);
  SDL_DestroyRenderer(renderer);
  SDL_DestroyWindow(window);

  return 0;
}