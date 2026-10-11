<?php
// Fallback entry point for Apache/Plesk servers where DirectoryIndex prioritizes index.php over index.html
header('Content-Type: text/html; charset=UTF-8');
readfile(__DIR__ . '/index.html');
