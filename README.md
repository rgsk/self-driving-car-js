## Purpose

Using Genetic Algorithms to Train Neural Networks, the car learns to navigate in traffic.

## Playlist followed

Self-driving car - No libraries - JavaScript course

By Radu Mariescu-Istodor

channel - https://www.youtube.com/@Radu

playlist - https://www.youtube.com/watch?v=NkI9ia2cLhc&list=PLB0Tybl0UNfYoJE7ZwsBQoDIG4YN9ptyY&pp=iAQB

## How to run

to install the packages

```
yarn

```

to run the the project

```
yarn dev
```

## How to test the functionality

open main.ts file, find the line const N = 100; currently line 61,

make it 1000, this will initialize 1000 cars following their own network,
some of those cars will navigate the traffic successfully, focus will be on first car (car that is ahead),
save the weights of the best car, by clicking on "Save" button.
Then click refresh, now the weights of cars will be initialized around weights of previously saved car,
currently we mutate by 20% in animate.ts, line - NeuralNetwork.mutate(brain, 0.2);

this time, the top most car should reach farther, keep repeating this process.
ultimately even if we keep 1 car (by setting N = 1) and use the saved weights of the car that was able to navigate all the traffic, this single car should be able to navigate all the traffic.

you can restart the process, by deleting the saved weights using "Discard" button.

## Preview

<a href="https://ibb.co/4Y1qb7W"><img src="https://i.ibb.co/GtH6Z07/ss1.png" alt="ss1" border="0" /></a>
