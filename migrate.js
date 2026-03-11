const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), '_posts');

function extractFrontMatter() {
  const fileNames = fs.readdirSync(postsDirectory);
  
  const allPostsData = fileNames.map(fileName => {
    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Return the frontmatter data and filename
    return {
      id: fileName.replace(/\.md$/, ''),
      ...matterResult.data
    };
  });

  return allPostsData;
}

const extractedData = extractFrontMatter();

console.log("--- Extracted Front-Matter (JSON) ---");
console.log(JSON.stringify(extractedData, null, 2));

// Save to a JSON file
const outputFilePath = path.join(process.cwd(), 'migrated-posts.json');
fs.writeFileSync(outputFilePath, JSON.stringify(extractedData, null, 2));

console.log(`\nSuccessfully saved extracted metadata to ${outputFilePath}`);
