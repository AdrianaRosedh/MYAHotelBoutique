document.addEventListener('DOMContentLoaded', function () {
  particlesJS('particles-js', {
      particles: {
          number: {
              value: 80,
              density: {
                  enable: true,
                  value_area: 800
              }
          },
          color: {
              value: '#ffffff'
          },
          shape: {
              type: 'circle',
              stroke: {
                  width: 0,
                  color: '#ff0000'
              },
              polygon: {
                  nb_sides: 5
              },
              image: {
                  src: 'img/github.svg',
                  width: 100,
                  height: 100
              }
          },
          opacity: {
              value: 0.5,
              random: true,
              anim: {
                  enable: true,
                  speed: 1,
                  opacity_min: 0.1,
                  sync: false
              }
          },
          size: {
              value: 8,
              random: true,
              anim: {
                  enable: true,
                  speed: 22,
                  size_min: 0.1,
                  sync: false
              }
          },
          line_linked: {
              enable: false,
              distance: 150,
              color: '#fff',
              opacity: 0,
              width: 1
          },
          move: {
              enable: true,
              speed: 3,
              direction: 'none',
              random: true,
              straight: false,
              out_mode: 'out',
              bounce: false,
              attract: {
                  enable: false,
                  rotateX: 600,
                  rotateY: 1200
              }
          },
          array: []
      },
      interactivity: {
          detect_on: 'canvas',
          events: {
              onhover: {
                  enable: true,
                  mode: 'repulse'
              },
              onclick: {
                  enable: true,
                  mode: 'bubble'
              },
              resize: true
          },
          modes: {
              grab: {
                  distance: 400,
                  line_linked: {
                      opacity: 1
                  }
              },
              bubble: {
                  distance: 400,
                  size: 20,
                  duration: 1,
                  opacity: 0.5,
                  speed: 3
              },
              repulse: {
                  distance: 150,
                  duration: 0.4
              },
              push: {
                  particles_nb: 4
              },
              remove: {
                  particles_nb: 2
              }
          },
          mouse: {}
      },
      retina_detect: true
  });
});
