import inquirer from 'inquirer';
import fs from 'fs';
import { Circle, Square, Triangle } from './lib/shapes.js';

//svg that takes color text and shape
class Svg {
	constructor() {
		this.textElement = '';
		this.shapeElement = '';
	}
	render() {
		return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="300" height="200">${this.shapeElement}${this.textElement}</svg>`;
	}
	setTextElement(text, color) {
		this.textElement = `<text x="150" y="125" font-size="60" text-anchor="middle" fill="${color}">${text}</text>`;
	}
	setShapeElement(shape) {
		this.shapeElement = shape.render();
	}
}

// prompt for user input for questions to create svg
function prompt() {
	return inquirer.prompt([
		{
			type: 'input',
			name: 'text',
			message: 'TEXT: Enter up to (3) Characters:',
			validate: (textinput) => {
				return textinput.length > 0 && textinput.length < 4
					? true
					: console.log('Please enter 1-3 characters');
			},
		},
		{
			type: 'input',
			name: 'text_color',
			message:
				'TEXT COLOR: Enter a color keyword (OR a hexadecimal number):',
			validate: (textColorinput) => {
				return textColorinput.length > 0
					? true
					: console.log('Please enter text color');
			},
		},
		{
			type: 'input',
			name: 'shape_color',
			message:
				'SHAPE COLOR: Enter a color keyword (OR a hexadecimal number):',
			validate: (shapeColorinput) => {
				return shapeColorinput.length > 0
					? true
					: console.log('Please enter shape color');
			},
		},
		{
			type: 'list',
			name: 'shape',
			message: 'Choose which shape you would like?',
			choices: ['Circle', 'Square', 'Triangle'],
		},
	]);
}

// Function to write data to file
function writeToFile(fileName, data) {
	console.log('Writing ' + data + ' to file ' + fileName);
	fs.writeFile(fileName, data, function (err) {
		if (err) {
			return console.log(err);
		}
		console.log('\n Congratulations, you have generated a logo!');
	});
}

async function init() {
	var svgString = '';
	var svg_file = 'logo.svg';

	// Prompt the user for answers
	const userInput = await prompt().then((data) => {
		console.log(data);
		return data;
	});

	let font_color = userInput.text_color;
	let shape_color = userInput.shape;
	let shape_type = userInput['shape'];

	let shape;
	switch (shape_type) {
		case 'Square':
			shape = new Square();
			break;
		case 'Circle':
			shape = new Circle();
			break;
		case 'Triangle':
			shape = new Triangle();
			break;
	}

	shape.setColor(shape_color);

	// Create a new Svg logo
	var svg = new Svg();
	svg.setTextElement(userInput.text, font_color);
	svg.setShapeElement(shape);
	svgString = svg.render();

	//Print shape to log
	console.log('Displaying shape:\n' + svgString);
	console.log('\n Writing logo to file...\n');
	writeToFile(svg_file, svgString);
}
init();
