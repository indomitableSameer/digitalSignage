package requesthandlers

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

func HandleLoginRequest(w http.ResponseWriter, r *http.Request) {

	fmt.Println("received /login request..")
	key, _ := os.ReadFile("/root/digitalSignage/pki/device-server/device-server-key.pem")
	jwtSecretKey, err := jwt.ParseECPrivateKeyFromPEM(key)
	if err != nil {
		fmt.Println("parsing private key failed.")
		return
	}

	expirationTime := time.Now().Add(24 * time.Minute)
	claims := &Claims{
		Username: "test",
		RegisteredClaims: jwt.RegisteredClaims{
			// In JWT, the expiry time is expressed as unix milliseconds
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	// Declare the token with the algorithm used for signing, and the claims
	token := jwt.NewWithClaims(jwt.SigningMethodES256, claims)
	// Create the JWT string
	tokenString, err := token.SignedString(jwtSecretKey)
	if err != nil {
		// If there is an error in creating the JWT return an internal server error
		fmt.Println(err)
		return
	}

	cookie := http.Cookie{
		Name:     "authToken",                    // Cookie name
		Value:    tokenString,                    // Token value
		Path:     "/",                            // Path for which the cookie is valid
		Expires:  time.Now().Add(24 * time.Hour), // Expiration time
		Secure:   true,                           // Mark as secure (HTTPS only)
		HttpOnly: true,                           // Prevent JavaScript access
		SameSite: http.SameSiteStrictMode,
	}
	http.SetCookie(w, &cookie)
	return
}
