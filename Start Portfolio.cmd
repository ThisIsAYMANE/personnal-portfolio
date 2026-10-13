@echo off
pushd "%~dp0"
echo Open http://127.0.0.1:5173 in your browser.
echo Keep this window open while viewing the portfolio. Press Ctrl+C to stop.
node scripts/serve.mjs
pause
popd
