@echo off
cls
cd content/tracks
FOR /D %%G in (*) DO (
	echo Removing existing ui folder for %%G
	rmdir  "%~dp0server\content\tracks\%%G\ui\" /s /q
	echo Creating ui folder for %%G
	mkdir "%~dp0server\content\tracks\%%G\ui"
	echo Copying ui folder for %%G
	xcopy /s /e /y %%G\ui "%~dp0server\content\tracks\%%G\ui"
)
cd ../cars
FOR /D %%G in (*) DO (
	echo Removing skins folder for %%G
	rmdir  "%~dp0server\content\cars\%%G\skins\" /s /q
	echo Creating skins folder for %%G
	mkdir "%~dp0server\content\cars\%%G\skins"
	echo Copying skins directory structure for %%G
	xcopy /t /e /y %%G\skins "%~dp0server\content\cars\%%G\skins"
)