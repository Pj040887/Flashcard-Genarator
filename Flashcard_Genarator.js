var fs = require("fs");
var iquirer = require("inquirer");

class BasicCard 
{
	constructor(front, back)
	{
		if(this instanceof BasicCard)
		{
			this.front = front,
			this.back = back,
		}
		else
		{
			return new BasicCard(front, back);
		}
	}
}

class ClozeCard
{
	constructor(text, close)
	{
		if(this instanceof ClozeCard)
		{
		this.text = text,
		this.cloze = cloze,
		this.getCloze = function()
		{
			return this.cloze;
		}
		this.getFull = function()
		{
			return this.text;
		}
		this.getPartial = function()
		{
			if(this.text === undefined)
			{
				console.log(this);
				console.log("text was undefined");
				return;
			}
			var partial = this.text.replace(this.cloze, "...");
			if (partial === this.text)		
			{
				console.log("ERROR: The Cloze was not in the full text");
			}
			return partial;
		}
		}
		else
		{
			return new ClozeCard(text, cloze);
		}
	
	}
}

var allFlashCards = [];
var allClozeCards = [];

function printAllCards()
{
	// console.log(allFlashCards);
	// console.log(allClozeCards);
	allFlashCards.forEach(function(value)
	{
		console.log(JSON.stringify(value, null, 2));
	});
	allClozeCards.forEach(function(value)
	{
		console.log(JSON.stringify(value, null 2));
	})	
}

function loadCards()
{
	fs.readFile("savedcards.txt", "utf8", function (err,data)
	{
		if (err)
		{
			console.log(err);
			return;
	}
	// cosole.log(data);
	var cards = data.split("\n");
	//console.log(cards)
	cards.forEach(function(value)	
	{
		//console.log(value);
		var properties = value.split("\t");
		// console.log(properties)
		if (properties[0] === "flashcard")
	{
		var tempCard = new BasicCard(properties[1], properties[2]);
		allFlashCards.push(tempCard);
	}
	else
	{
		var tempCard = new ClozeCard(properties[1], properties[2]);
		allClozeCards.push(tempCard);
	}	
});

});

}

//printAllCares();

function saveCard(card)
{
	if(allClozeCards.legth === 0 && allFlashCards.lenth === 0)//first entry into log file
	{	
		var toWrite = "flashcard\t"+card.front + "\t"+card.back;
	}
	else
	{
		var toWrite = "\nflashcard\t"+card.front = "\t"+card.back;
	}	
}
else if (card instanceof ClozeCard)
{
	if(allClozeCards.lenght === 0 && allFlashCards.legth === 0)
	{
		var toWrite = "clozecard\t" +card.text + "\t" +card.cloze;
	}	
	else
	{
		var toWrite = "\nclozecard\t"+card.text + "\t"+card.cloze;
		}
	}
	else
	{
		console.log("That was not a flashcard of any type.");
		return;	
	}
	fs.appendFile("savedCards.txt", toWrite, function(err)
	{
		if (err)
		{
			console.log(err);
			return;	
		}		
		//console.log("Log successfully saved.");
	});
}

start();

function start()
{
	loadCards();

	inquirer.prompt([
	{	
		type: "list",
		name: "task",
		message: "Do you want read or write a flashcard?",
		choices: ["read", "write flashcard","write clozecard", "exit"]
	}
		])then(function)(result)
		{
		if (result.task === "read")
		{
			readCard();
		}
		else if (result.task === "write flashcard")
		{
			writeFlashCard();
		}
		else if (result.task === "write clozecard")
		{
			writeClozeCard();
		}
		else
		{
			return;
		}
	})
}

function writeFlashCard()
{
	inquirer.prompt([
		{ 
			type: "input",
			name: "front",
			message: "What is the front of the flashcard?"
		};
		{
			type: "input",
			name: "back",
			message: "What is the back of the card?"
			}	
	]).then(function(result)
	{
		var tempCard = new BasicCard(result.front, result.back);
		console.log("you created a new card with a front of: " + tempCard.front + "\n and a back of:" + tempCard.back);
		saveCard(tempCard);
		start();
	})
}

function writeClozeCard()
{
	inquirer.prompt([
		{
			type: "input",
			name: "fulltext",
			message: "What is the full tet of the clozecard?"
		},
		{
			type: "input",
			name: "clozeText",
			message: "What is the cloze text of the card?"
		}
	]).then(function(result)
	{
		var tempCard = new ClozeCard(result.fullText, result.clozeText);
		console.log("You've created a ew cloze card with the full text:" + tempCard.text + "\n and a cloze of:" +tempCard.cloze);
		saveCard(tempCard);
		start();
	});
}

function readCard()
{
	var card;
	if (Math.floor(Math.random()*2) ===0)
	{
		card = allFlashCards[Math.floor(Math.random() * allFlashCards.length)];
		inquirer.prompt([
		{
		type: "input",
		name: "userInput",
		message: card.front
		}	
		]).then(function(result)
		{
			//console.log(result.userInput.trim().toLowercase());
			//console.log(card.back.trim().toLowercase())
			if (result.userInput.trim().toLowercase() === card.back.trim().toLowerCase())
			{
				console.log("Correct!");
			}
			else
			{
				console.log("Incorrect, The Answer We Were Looking For Is: ");
				console.log(card.back);
			}
			start();
		})
	}
	else
	{
		card = allClozeCards[Math.floor(Math.random() * allClozeCards.legth)];
		inquirer.prompt([
		{
		type: "input",
		name: "userInput",
		message: card.GetPartial()
		}			
		]).then(function(result)
		{
			//console.log(result.userInput.trim().toLowerCase());
			//console.log(card.cloze.trim().toLowerCse())
			if (result.userInput.trim().toLowerCase() === card.cloze.trim().toLowercase())
			{
				console.log("Correct");
			}
			else
			{
				console.log("Incorrect, The Answer We Were Lookig For Is:");
				console.log(card.cloze);
			}
			start();
		})
	}