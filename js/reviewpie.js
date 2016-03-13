<script>
var pie = new d3pie("pieChart", {
	"header": {
		"title": {
			"text": "Quality of Reviews",
			"color": "#c02323",
			"fontSize": 24,
			"font": "open sans"
		},
		"subtitle": {
			"color": "#999999",
			"fontSize": 12,
			"font": "open sans"
		},
		"titleSubtitlePadding": 9
	},
	"footer": {
		"color": "#999999",
		"fontSize": 10,
		"font": "open sans",
		"location": "bottom-left"
	},
	"size": {
		"canvasWidth": 590,
		"pieInnerRadius": "54%",
		"pieOuterRadius": "80%"
	},
	"data": {
		"sortOrder": "value-desc",
		"content": [
			{
				"label": "Cool Vote",
				"value": 67706,
				"color": "#3c96d0"
			},
			{
				"label": "Funny Vote",
				"value": 36344,
				"color": "#6affce"
			},
			{
				"label": "Useful Vote",
				"value": 32170,
				"color": "#5e1fa6"
			}
		]
	},
	"labels": {
		"outer": {
			"pieDistance": 32
		},
		"inner": {
			"hideWhenLessThanPercentage": 3
		},
		"mainLabel": {
			"fontSize": 11
		},
		"percentage": {
			"color": "#ffffff",
			"decimalPlaces": 0
		},
		"value": {
			"color": "#adadad",
			"fontSize": 11
		},
		"lines": {
			"enabled": true
		},
		"truncation": {
			"enabled": true
		}
	},
	"effects": {
		"pullOutSegmentOnClick": {
			"effect": "linear",
			"speed": 400,
			"size": 8
		}
	},
	"misc": {
		"gradient": {
			"enabled": true,
			"percentage": 100
		}
	},
	"callbacks": {}
});
</script>
