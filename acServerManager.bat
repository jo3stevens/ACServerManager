@echo off
cls
cd content/tracks
FOR /D %%G in (*) DO (
	rmdir  "%~dp0server\content\tracks\%%G\ui\" /s /q
	mkdir "%~dp0server\content\tracks\%%G\ui"
	xcopy /s /e /y %%G\ui "%~dp0server\content\tracks\%%G\ui"
)
cd ../cars
FOR /D %%G in (*) DO (
	rmdir  "%~dp0server\content\cars\%%G\skins\" /s /q
	mkdir "%~dp0server\content\cars\%%G\skins"
	xcopy /t /e /y %%G\skins "%~dp0server\content\cars\%%G\skins"
)