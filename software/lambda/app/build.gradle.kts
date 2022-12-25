import dependencies.PackageVersions
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

application {
    // Define the main class for the application.
    mainClass.set("io.mycdkapp.api.ApplicationKt")
}

plugins {
    id("com.github.johnrengelman.shadow") version "7.1.2" // This is used to build jar usable by AWS lambda
    // By default, spring boot puts all the compiled .class files in BOOT-INF directory in the jar,
    // The shadowJar task creates a jar suffixed with "-all.jar" containing all class files
    id("io.mycdkapp.kotlin-application-conventions")
}

group = "io.mycdkapp"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation(project(":common"))

    implementation("org.jetbrains.kotlin:kotlin-reflect")

    implementation("com.amazonaws:aws-lambda-java-core:1.2.1")

    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:${PackageVersions.Jackson}")
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "11"
    }
}

tasks.shadowJar {
    // Artifact used for AWS Lambda
    archiveFileName.set("${project.name}-${project.version}-lambda.jar")
}

tasks {
    build {
        dependsOn(shadowJar)
    }
}
