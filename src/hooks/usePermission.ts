type permissions = "granted" | "prompt" | "denied";

export function useAddress() {
  function report(state: permissions) {
    return state;
  }

  navigator.permissions.query({ name: "geolocation" }).then((result) => {
    if (result.state === "granted") {
      report(result.state);
    } else if (result.state === "prompt") {
      report(result.state);

      navigator.geolocation.getCurrentPosition(
        revealPosition,
        positionDenied,
        geoSettings
      );
    } else if (result.state === "denied") {
      report(result.state);
    }
  });

  function revealPosition(position: GeolocationPosition) {
    console.log("Position revealed:", position);
  }

  function positionDenied(error: GeolocationPositionError) {
    console.log("Position denied:", error.message);
  }

  const geoSettings: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
}
