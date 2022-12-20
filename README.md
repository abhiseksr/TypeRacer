# TypeRacer
Multiplayer typing race, used socket.io for users statistics communication. Users are automatically alloted vacant room.

1. To run the project on local machine, clone the repositery.
2. In the outermost directory where index.js located issue the follwing commands - 
    npm install
    nodemon index.js
3. Server is serving on port number 3000. Open the url http://localhost:3000 in your web browser.
4. You should be able to see the followings - 

<img width="1440" alt="Screenshot 2022-12-20 at 10 03 01 AM" src="https://user-images.githubusercontent.com/85542595/208585200-0aee01c0-0ae7-48bf-b8eb-0e13ff56168c.png">
<img width="1440" alt="Screenshot 2022-12-20 at 10 03 14 AM" src="https://user-images.githubusercontent.com/85542595/208585318-b724b687-8761-4992-bd20-6a4ed777213a.png">

5. The timer is set on the server side, and not on the client side. Therefore as countdown becomes zero the race begins. 

6. The number of players on the server may be different from the number of players in your room - 

<img width="1440" alt="Screenshot 2022-12-20 at 9 55 50 AM" src="https://user-images.githubusercontent.com/85542595/208585698-59f32f57-c5cd-45c6-b4fe-4ac16ca9db10.png">

7. When a user completes the race he instantly recieves the result. He doesn't have to wait for other players. The result table is dynamic. It keeps rendering for new users to finish.

<img width="1440" alt="Screenshot 2022-12-20 at 9 56 06 AM" src="https://user-images.githubusercontent.com/85542595/208585957-6f914a96-071b-4b08-bedc-38f89c56b04b.png">
