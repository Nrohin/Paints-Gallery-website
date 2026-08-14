/* ==========================================================================
   PAINT'S GALLERY — SEARCH DATA
   All searchable items live here. The search engine (search.js) never
   hardcodes content — it only reads from this file.

   Fields:
   - title     : Display title of the result
   - type      : "page" | "product" | "category" | "section" | "popular"
   - category  : Human readable grouping label used under the title
   - url       : Destination URL (relative to site root)
   - keywords  : Extra words that should match this item (lowercase)
   - aliases   : Alternate phrases / synonyms users might type (lowercase)
   - popular   : true if it should appear in the "Popular Searches" list
   ========================================================================== */

window.pgSearchData = [
  /* ---------------------------- PAGES ---------------------------- */
  {
    title: "Home",
    type: "page",
    category: "Page",
    url: "index.html#home",
    keywords: ["home", "homepage", "main", "start", "landing"],
    aliases: ["main page", "landing page"],
  },
  {
    title: "About Us",
    type: "page",
    category: "Page",
    url: "index.html#about",
    keywords: ["about", "story", "company", "who we are", "history"],
    aliases: ["our story", "about paint's gallery"],
  },
  {
    title: "Products",
    type: "page",
    category: "Page",
    url: "index.html#products",
    keywords: ["products", "paints", "range", "catalogue", "catalog"],
    aliases: ["all products", "paint range", "shop"],
  },
  {
    title: "Paint Calculator",
    type: "page",
    category: "Tool",
    url: "index.html#estimator",
    keywords: ["calculator", "estimator", "estimate", "quantity", "how much paint", "cost calculator", "coverage"],
    aliases: ["paint estimator", "paint tool", "estimation tool", "calclator", "calculater"],
    popular: true,
  },
  {
    title: "Services",
    type: "page",
    category: "Page",
    url: "index.html#services",
    keywords: ["services", "painting service", "consultation", "application"],
    aliases: ["painting services", "what we offer"],
  },
  {
    title: "Color Visualizer",
    type: "page",
    category: "Tool",
    url: "index.html#visualizer",
    keywords: ["visualizer", "colour visualizer", "color tool", "preview", "shade selector", "colour"],
    aliases: ["paint tool", "visulizer", "colour visualiser", "color preview", "try colors"],
    popular: true,
  },
  {
    title: "Contact",
    type: "page",
    category: "Page",
    url: "index.html#contact",
    keywords: ["contact", "reach us", "location", "phone", "address", "get in touch", "showroom"],
    aliases: ["contact us", "call us", "find us"],
  },

  /* ------------------------- PRODUCT PAGES ------------------------- */
  {
    title: "Interior Wall Paints",
    type: "product",
    category: "Product",
    url: "interior.html",
    keywords: ["interior", "wall paint", "nerolac", "knp", "indoor paint", "room paint"],
    aliases: ["wall paint", "indoor paint", "interior paint", "intirior", "interor", "room colour"],
    popular: true,
  },
  {
    title: "Exterior Paints",
    type: "product",
    category: "Product",
    url: "exterior.html",
    keywords: ["exterior", "outdoor paint", "nerolac", "knp", "weather resistant", "facade paint"],
    aliases: ["outside paint", "weather coat", "exterior paint", "extirior", "exteriour", "facade"],
    popular: true,
  },
  {
    title: "Primers",
    type: "product",
    category: "Product",
    url: "primer.html",
    keywords: ["primer", "base coat", "undercoat", "nerolac", "knp", "wall prep"],
    aliases: ["base coat", "undercoat", "primer paint", "primar", "primmer"],
  },
  {
    title: "Enamel Paints",
    type: "product",
    category: "Product",
    url: "enamel.html",
    keywords: ["enamel", "metal paint", "wood paint", "gloss paint", "nerolac", "knp"],
    aliases: ["metal enamel", "wood enamel", "gloss finish", "enemal", "anamel"],
  },
  {
    title: "Putty",
    type: "product",
    category: "Product",
    url: "putty.html",
    keywords: ["putty", "wall putty", "smoothing", "nerolac", "knp", "surface finish"],
    aliases: ["wall putty", "putty paint", "puty", "putti"],
  },
  {
    title: "Distemper",
    type: "product",
    category: "Product",
    url: "distemper.html",
    keywords: ["distemper", "budget paint", "nerolac", "knp", "economy paint"],
    aliases: ["distemper paint", "dispemper", "distember"],
  },
  {
    title: "Waterproofing",
    type: "product",
    category: "Product",
    url: "waterproof.html",
    keywords: ["waterproofing", "waterproof", "leak", "seepage", "damp proofing", "nerolac", "knp"],
    aliases: ["water seal", "water proof", "leak proofing", "everlast", "everlsat", "water prof", "seepage solution"],
    popular: true,
  },

  /* --------------------------- CATEGORIES --------------------------- */
  {
    title: "Nerolac Paints",
    type: "category",
    category: "Brand",
    url: "index.html#products",
    keywords: ["nerolac", "brand", "genuine nerolac"],
    aliases: ["nerolak", "nerolec", "nirolac"],
  },
  {
    title: "KNP Paints",
    type: "category",
    category: "Brand",
    url: "index.html#products",
    keywords: ["knp", "brand"],
    aliases: ["k n p paints"],
  },

  /*exterior product */
  {
    title: "Everlast Exterior Range",
    type: "category",
    category: "Product Range",
    url: "exterior.html#everlast",
    keywords: ["everlast", "exterior range", "weatherproof range"],
    aliases: ["everlsat", "everlast paint"],
  },
  
  /* product*/ 
  {
   title: "KNP Nerolac Excel Total",
    type: "product",
    category: "Exterior Paint",
    url: "exterior.html#total",
    keywords: ["total", "exterior range", "excel", "Exterior Paint","excel total","total excel","paint","color"],
    aliases: ["everlsat", "everlast paint", "excel" , "mica", "marbel"],
  },

 {
   title: "KNP Nerolac Excel Anti peel",
    type: "product",
    category: "Exterior Paint",
    url: "exterior.html#anti-peel",
    keywords: ["total", "exterior range", "excel", "Exterior Paint","anti peel","anti","paint","color"],
    aliases: ["everlsat", "everlast paint", "excel" , "mica", "marbel"],
  }, 

  {
     title: "KNP Nerolac Suraksha Plus+",
    type: "product",
    category: "Exterior Paint",
    url: "exterior.html#suraksha-plus",
    keywords: ["total", "exterior range", "excel", "Exterior Paint","suraksha plus+","suraksha","plus","color","+"],
    aliases: ["everlsat", "everlast paint", "excel" , "mica", "marbel"],
  }, 

   {
   title: "KNP Nerolac Excel Mica Marble",
    type: "product",
    category: "Exterior Paint",
    url: "exterior.html#mica",
    keywords: ["total", "exterior range", "excel", "Exterior Paint","Mica Marble","mica","marble","color","+"],
    aliases: ["everlsat", "everlast paint", "excel" , "mica", "marbel"],
  }, 
/*INterior  */
   {
   title: "KNP Nerolac IMPRESSIONS Eco clean ",
    type: "product",
    category: "Interior Paint",
    url: "Interior.html#eco-clean",
    keywords: ["Impression", "Interior range", "impressions", "Interior Paint","impressions eco clean","exo","clean","color","super premium","ultra luxury emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
  }, {

     title: "KNP Nerolac IMPRESSIONS HD ",
    type: "product",
    category: "Interior Paint",
    url: "Interior.html#hd",
    keywords: ["Impression", "Interior range", "impressions", "Interior Paint","impressions HD","HD","eco clean","color","premium","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
  }, 

  {

     title: "KNP Nerolac Beauty Gold Washable",
    type: "product",
    category: "Interior Paint",
    url: "Interior.html#washable",
    keywords: ["Impression", "Interior range", "Beauty gold wasable", "Interior Paint","beauy","gold","washable","color","premium","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
  }, 

  {

     title: "KNP Nerolac Beauty Gold Classic ",
    type: "product",
    category: "Interior Paint",
    url: "Interior.html#classic",
    keywords: ["Impression", "Interior range", "Beauty", "Interior Paint","Beauty Gold Washable","washable","rich Finish","color","premium","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean","washable"],
  }, 

  {

     title: "KNP Nerolac Beauty Little Master",
    type: "product",
    category: "Interior Paint",
    url: "Interior.html#master",
    keywords: ["Impression", "Interior range", "Beauty Little Mater", "Interior Paint","little master","little","eco clean","color","master","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
  }, 
  
  /*distemper*/{

  title: "KNP Nerolac Beauty Acrylic Distemper",
    type: "product",
    category: "Distemper",
    url: "distemper.html#Acrylic-Distemper",
    keywords: ["Impression", "Interior range", "Beauty Little Mater", "Interior Paint","little master","little","eco clean","color","master","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
  }, 

  /*enamel*/
  {title: "KNP Nerolac PU Enamel 10 in 1",
    type: "product",
    category: "Enamel Paint",
    url: "enamel.html#pu",
    keywords: ["Impression", "Interior range", "Beauty Little Mater", "Interior Paint","little master","little","eco clean","color","master","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
  }, 
  {title: "KNP Nerolac Synthetic HI-Gloss Enamel",
    type: "product",
    category: "Enamel Paint",
    url: "enamel.html#hi-gloss",
    keywords: ["Impression", "Interior range", "Beauty Little Mater", "Interior Paint","little master","little","eco clean","color","master","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
  }, 

  {title: "KNP Nerolac Satin Enamel",
    type: "product",
    category: "Enamel Paint",
    url: "enamel.html#satin",
    keywords: ["Impression", "Interior range", "Beauty Little Mater", "Interior Paint","little master","little","eco clean","color","master","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
  }, 

  /*putty */

  {title: "KNP Nerolac Cement Putty",
    type: "product",
    category: " Putty",
    url: "putty.html#cement",
    keywords: ["Impression", "Interior range", "Beauty Little Mater", "Interior Paint","little master","little","eco clean","color","master","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
  }, 
  {title: "KNP Nerolac Acrylic Wall Putty",
    type: "product",
    category: " Putty",
    url: "putty.html#acrylic",
    keywords: ["Impression", "Interior range", "Beauty Little Mater", "Interior Paint","little master","little","eco clean","color","master","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
    
  }, 

  {title: "KNP Nerolac Waterproof Premium Putty",
    type: "product",
    category: "Putty",
    url: "putty.html#waterproof",
    keywords: ["Impression", "Interior range", "Beauty Little Mater", "Interior Paint","little master","little","eco clean","color","master","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
  }, 

  /*Waterproofing */
  {title: "KNP Nerolac NO-Damp",
    type: "product",
    category: " Waterproofing",
    url: "waterproof.html#no-damp",
    keywords: ["Impression", "Interior range", "Beauty Little Mater", "Interior Paint","little master","little","eco clean","color","master","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
  }, 
  {title: "KNP Nerolac Damp Protect Interior",
    type: "product",
    category: " Waterproofing",
    url: "waterproof.html#interior-damp",
    keywords: ["Impression", "Interior range", "Beauty Little Mater", "Interior Paint","little master","little","eco clean","color","master","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
  }, 

  {title: "KNP Nerolac Damp Protect Exterior",
    type: "product",
    category: " Waterproofing",
    url: "waterproof.html#exterior-damp",
    keywords: ["Impression", "Interior range", "Beauty Little Mater", "Interior Paint","little master","little","eco clean","color","master","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
  }, 
  {title: "KNP Nerolac Crack Filler",
    type: "product",
    category: " Waterproofing",
    url: "waterproof.html#crack",
    keywords: ["Impression", "Interior range", "Beauty Little Mater", "Interior Paint","little master","little","eco clean","color","master","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
  }, 

  /*primer */
  {title: "KNP Nerolac Wood Primer ",
    type: "product",
    category: "Primer",
    url: "primer.html#wood",
    keywords: ["Impression", "Interior range", "Beauty Little Mater", "Interior Paint","little master","little","eco clean","color","master","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
  }, 
  {title: "KNP Nerolac Exterior Primer ",
    type: "product",
    category: "Primer",
    url: "primer.html#exterior-primer",
    keywords: ["Impression", "Interior range", "Beauty Little Mater", "Interior Paint","little master","little","eco clean","color","master","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
  }, 
  {title: "KNP Nerolac Red Oxide Metal Primer ",
    type: "product",
    category: "Primer",
    url: "primer.html#oxide",
    keywords: ["oxide", "Interior range", "Beauty Little Mater", "Interior Paint","little master","little","eco clean","color","master","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
  }, 
  {title: "KNP Nerolac Aluminum Paint ",
    type: "product",
    category: "Primer",
    url: "primer.html#al",
    keywords: ["Impression", "Interior range", "Beauty Little Mater", "Interior Paint","little master","little","eco clean","color","master","emulsion"],
    aliases: ["beauty hd", "interior paint", "gold" , "hd", "eco clean"],
  }, 
  /* --------------------------- SERVICES --------------------------- */
  {
    title: "Colour Consultation",
    type: "section",
    category: "Service",
    url: "index.html#services",
    keywords: ["colour consultation", "color consultation", "advice", "expert advice"],
    aliases: ["color advice", "shade consultation"],
  },
  {
    title: "Professional Painting Service",
    type: "section",
    category: "Service",
    url: "index.html#services",
    keywords: ["painting service", "painter", "application service", "professional painters"],
    aliases: ["hire painter", "painting contractor"],
  },
];
