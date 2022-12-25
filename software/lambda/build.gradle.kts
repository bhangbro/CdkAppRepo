plugins {
    id("io.mycdkapp.kotlin-library-conventions")
}

allprojects {
    val project = this
    group = "io.mycdkapp"
}

object CustomSpec {
    val JVM_VERSION = JavaVersion.VERSION_11
}

subprojects {
    tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
        sourceCompatibility = CustomSpec.JVM_VERSION.toString()
        targetCompatibility = CustomSpec.JVM_VERSION.toString()

        kotlinOptions {
            jvmTarget = JavaVersion.VERSION_11.toString()
//            allWarningsAsErrors = true
        }
    }
}

java {
    sourceCompatibility = CustomSpec.JVM_VERSION
    targetCompatibility = CustomSpec.JVM_VERSION
}